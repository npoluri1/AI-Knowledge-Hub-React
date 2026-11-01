from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum, auto
from typing import Protocol, runtime_checkable

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...
    def describe(self) -> str:            # concrete method on abstract class
        return f"{type(self).__name__} area={self.area():.2f}"

@dataclass(frozen=True, slots=True)
class Circle(Shape):
    r: float
    def area(self) -> float: return 3.14159 * self.r ** 2

@runtime_checkable
class Drawable(Protocol):                 # static duck typing
    def area(self) -> float: ...

class Color(Enum):
    RED = auto(); GREEN = auto()

class Temperature:
    def __init__(self, celsius: float = 0): self._c = celsius
    @property
    def celsius(self) -> float: return self._c
    @celsius.setter
    def celsius(self, v: float):
        if v < -273.15: raise ValueError("below absolute zero")
        self._c = v
    @property
    def fahrenheit(self) -> float: return self._c * 9 / 5 + 32

class Vector:
    __slots__ = ("x", "y")
    def __init__(self, x: float, y: float): self.x, self.y = x, y
    def __add__(self, o: "Vector") -> "Vector": return Vector(self.x + o.x, self.y + o.y)
    def __repr__(self) -> str: return f"Vector({self.x}, {self.y})"
    def __eq__(self, o: object) -> bool:
        return isinstance(o, Vector) and (self.x, self.y) == (o.x, o.y)
    def __hash__(self) -> int: return hash((self.x, self.y))

if __name__ == "__main__":
    shapes: list[Shape] = [Circle(1), Circle(2.5)]
    for s in shapes:
        assert isinstance(s, Drawable)     # protocol runtime check
        print(s.describe())
    t = Temperature(); t.celsius = 100
    print("100C =", t.fahrenheit, "F")
    print(Vector(1, 2) + Vector(3, 4), Vector(1, 1) == Vector(1, 1))
    try:
        t.celsius = -300
    except ValueError as e:
        print("blocked:", e)